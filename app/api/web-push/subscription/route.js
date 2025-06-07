import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:laporkkbupatikupang@rumahclick314.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.NEXT_PUBLIC_VAPID_PRIVATE_KEY,
);

// Simpan ke variabel global sementara
let subscription = null;

export async function POST(req) {
  const body = await req.json();
  subscription = body.subscription;

  console.log('✅ Subscription received:', subscription);

  return new Response(
    JSON.stringify({ message: 'Subscription set successfully' }),
    { status: 200 }
  );
}

// Untuk ekspor langganan agar bisa dibaca di route send.js
export function getSubscription() {
  return subscription;
}