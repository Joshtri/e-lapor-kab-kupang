import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:' + process.env.NEXT_PUBLIC_VAPID_EMAIL,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.NEXT_PUBLIC_VAPID_PRIVATE_KEY,
);

let subscription = null;

export async function subscriberUser(sub) {
  subscription = sub;

  return { success: true };
}

export async function POST(request) {
  const { pathname } = new URL(request.url);
  switch (pathname) {
    case '/api/web-push/subscription':
      return setSubscription(request);
    case '/api/web-push/send':
      return sendPush(request);
    default:
      return notFoundApi();
  }
}

async function setSubscription(request) {
  const body = await request.json();
  subscription = body.subscription;
  return new Response(JSON.stringify({ message: 'Subscription set.' }), {});
}

async function sendPush(request) {
  console.log(subscription, 'subs');
  const body = await request.json();
  const pushPayload = JSON.stringify(body);
  await webpush.sendNotification(subscription, pushPayload);
  return new Response(JSON.stringify({ message: 'Push sent.' }), {});
}

export async function unsubscriberUser() {
  if (!subscription) {
    return { success: false, error: 'No subscription found' };
  }

  // Here you would typically remove the subscription from your database
  // For this example, we just clear the local variable
  subscription = null;

  return { success: true };
}

export async function sendNotification(message) {
  if (!subscription) {
    return { success: false, error: 'No subscription found' };
  }

  try {
    await webpush.sendNotification(subscription, JSON.stringify(message));
    return { success: true };
  } catch (error) {
    console.error('Error sending notification:', error);
    return { success: false, error: error.message };
  }
}

async function notFoundApi() {
  return new Response(JSON.stringify({ error: 'Invalid endpoint' }), {
    headers: { 'Content-Type': 'application/json' },
    status: 404,
  });
}
