import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:' + process.env.NEXT_PUBLIC_VAPID_EMAIL,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.NEXT_PUBLIC_VAPID_PRIVATE_KEY,
);

// ✅ Hardcoded sementara (boleh)
const subscription = {
  endpoint:
    'https://fcm.googleapis.com/fcm/send/ceYO9X_94rQ:APA91bHzfDP8ukEmv0Euka5e6uegPf9YxxPP8_80-7Bz0AEtsLNZq7kADWIiEE8WLHbjm1sz42ZOc62JWfnRZjapeIfdLOvvw6AxnnC3BI8AdfP57pGEkA_mniSd2T9PP3urAhab1Slo',
  expirationTime: null,
  keys: {
    p256dh:
      'BMO_i2YHma_4F2MNcJ2o1PxyZU5wOJopDBmMzaNABNlCCw8BvcmURxxhiloCct2rv4M-Q-A6_5TdR256ap1_Dbc',
    auth: '7H08EspcdGQwilDL8h1TxQ',
  },
};

export async function POST(req) {
  try {
    const body = await req.json();
    const payload = JSON.stringify({
      title: body.title || 'Test Push',
      body: body.body || 'This is a test push notification',
      icon: body.icon || '/next.png',
      image: body.image || '',
      url: body.url || 'https://google.com',
    });

    await webpush.sendNotification(subscription, payload);
    return new Response(
      JSON.stringify({ message: '✅ Push sent successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('❌ Push failed:', error);
    return new Response(
      JSON.stringify({
        error: '❌ Failed to send push',
        detail: error.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
