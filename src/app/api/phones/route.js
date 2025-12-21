import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const phones = [
      { id: 1, name: 'iPhone 14', brand: 'Apple', price: 1200, color: 'Black' },
      {
        id: 2,
        name: 'Samsung Galaxy S23',
        brand: 'Samsung',
        price: 1000,
        color: 'White',
      },
      {
        id: 3,
        name: 'Google Pixel 7',
        brand: 'Google',
        price: 900,
        color: 'Blue',
      },
    ];

    const { searchParams } = new URL(request.url);
    const brand = searchParams.get('brand');
    const price = searchParams.get('price');
    const color = searchParams.get('color');

    let filteredPhones = phones;

    if (brand) {
      filteredPhones = filteredPhones.filter(
        (phone) => phone.brand.toLowerCase() === brand.toLowerCase()
      );
    }
    if (price) {
      const priceNum = Number(price);
      if (!isNaN(priceNum) && priceNum >= 0) {
        filteredPhones = filteredPhones.filter(
          (phone) => phone.price <= priceNum
        );
      }
    }
    if (color) {
      filteredPhones = filteredPhones.filter(
        (phone) => phone.color.toLowerCase() === color.toLowerCase()
      );
    }

    return NextResponse.json(filteredPhones);
  } catch (error) {
    console.error('Error in phones API:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
