import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { router } from "expo-router";
import type { Href } from "expo-router";
import { supabase } from "@/lib/supabase";

// Configure foreground notification presentation globally (called at module level
// so it takes effect before any notification arrives).
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Requests permission and returns the Expo push token for this device.
 * Returns null if permission is denied or the token cannot be fetched
 * (e.g. running on a simulator without the Push Notifications capability).
 *
 * NOTE: Pass your EAS projectId for production builds:
 *   Notifications.getExpoPushTokenAsync({ projectId: "<your-eas-project-id>" })
 */
export async function getExpoPushToken(): Promise<string | null> {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") return null;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#4F46E5",
    });
  }

  try {
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: "ee9afc91-c642-4840-84e1-f4f88a3090e5",
    });
    return token.data;
  } catch {
    // Silently fail on simulators / devices without push capability
    return null;
  }
}

/**
 * Registers the current device's push token in the database for the given user.
 * Safe to call multiple times — uses upsert so duplicates are ignored.
 */
export async function registerDeviceToken(userId: string): Promise<void> {
  const token = await getExpoPushToken();
  if (!token) return;

  await supabase.from("device_tokens").upsert(
    {
      user_id: userId,
      token,
      platform: Platform.OS as "ios" | "android",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,token" },
  );
}

/**
 * Removes the current device's push token from the database on sign-out,
 * so the user stops receiving notifications on this device.
 */
export async function unregisterDeviceToken(userId: string): Promise<void> {
  const token = await getExpoPushToken();
  if (!token) return;

  await supabase
    .from("device_tokens")
    .delete()
    .match({ user_id: userId, token });
}

/**
 * Attaches listeners for:
 * - Notifications received while the app is in the foreground (logged, no action needed)
 * - Notification taps — if the payload includes `data.screen`, the app navigates there
 *
 * Mount this hook once in the root layout.
 */
type NotificationSubscription = ReturnType<
  typeof Notifications.addNotificationReceivedListener
>;

export function useNotificationListeners() {
  const receivedListener = useRef<NotificationSubscription | null>(null);
  const responseListener = useRef<NotificationSubscription | null>(null);

  useEffect(() => {
    receivedListener.current = Notifications.addNotificationReceivedListener(
      () => {
        // Notification arrived while app is open — presentation is handled by
        // setNotificationHandler above; add custom in-app UI here if needed.
      },
    );

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const screen = response.notification.request.content.data?.screen;
        if (typeof screen === "string") {
          router.push(screen as Href);
        }
      });

    return () => {
      receivedListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);
}
