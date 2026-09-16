import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { SHOP_PRODUCTS } from "@/lib/shop/products";

let stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-04-22.dahlia",
    });
  }
  return stripe;
}

export async function POST(req: NextRequest) {
  try {
    const { lines } = await req.json();

    if (!lines || lines.length === 0) {
      return NextResponse.json(
        { error: "El carrito está vacío" },
        { status: 400 }
      );
    }

    const lineItems = [];

    for (const line of lines as { productId?: string; quantity?: number }[]) {
      const product = SHOP_PRODUCTS.find((p) => p.id === line.productId);
      const quantity = Number(line.quantity);

      if (!product) {
        return NextResponse.json(
          { error: `Producto no encontrado: ${line.productId}` },
          { status: 400 }
        );
      }
      if (!Number.isInteger(quantity) || quantity < 1) {
        return NextResponse.json(
          { error: `Cantidad inválida para ${product.name}` },
          { status: 400 }
        );
      }

      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: product.name,
            description: product.description,
          },
          // El precio SIEMPRE sale del catálogo del servidor, nunca del body del cliente.
          unit_amount: Math.round(product.price * 100),
        },
        quantity,
      });
    }

    const session = await getStripe().checkout.sessions.create({
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