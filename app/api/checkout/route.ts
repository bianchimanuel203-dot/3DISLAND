import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

export async function POST(req: NextRequest) {
  try {
    const { lines } = await req.json();

    if (!lines || lines.length === 0) {
      return NextResponse.json(
        { error: "El carrito está vacío" },
        { status: 400 }
      );
    }

    const lineItems = lines.map((line: {
      product: { name: string; description: string; price: number };
      quantity: number;
    }) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: line.product.name,
          description: line.product.description,
        },
        unit_amount: Math.round(line.product.price * 100),
      },
      quantity: line.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
      shipping_address_collection: {
        allowed_countries: ["ES", "DE", "FR", "GB", "IT", "PT"],
      },
      metadata: {
        source: "3dra-island",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    return NextResponse.json(
      { error: "Error al crear la sesión de pago" },
      { status: 500 }
    );
  }
}