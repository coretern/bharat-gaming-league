import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const paymentSessionId = searchParams.get('paymentSessionId');
  if (!paymentSessionId) {
    return new NextResponse('Missing paymentSessionId', { status: 400 });
  }

  const isSandbox = (process.env.CASHFREE_BASE_URL || '').includes('sandbox');
  const mode = isSandbox ? 'sandbox' : 'production';

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>BGL Payment Checkout</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://sdk.cashfree.com/js/v3/cashfree.js"></script>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0b0f19;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }
    .loader {
      border: 3px solid rgba(255,255,255,0.1);
      border-radius: 50%;
      border-top: 3px solid #1a73e8;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    h3 {
      font-weight: 600;
      margin: 0 0 8px 0;
      letter-spacing: 0.5px;
    }
    p {
      color: #94a3b8;
      font-size: 14px;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="loader"></div>
  <h3>Secure checkout</h3>
  <p>Initializing payment session...</p>
  <script>
    window.onload = function() {
      try {
        const cashfree = window.Cashfree({ mode: "${mode}" });
        cashfree.checkout({
          paymentSessionId: "${paymentSessionId}",
          redirectTarget: "_self"
        });
      } catch (err) {
        document.body.innerHTML = '<div style="padding: 20px; text-align: center;"><h3>Checkout Error</h3><p>' + err.message + '</p></div>';
      }
    };
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
