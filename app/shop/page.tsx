import type { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import { ShopProvider } from "@/components/shop/shop-context"
import { CartSidebar } from "@/components/shop/cart-sidebar"
import { ProductCard } from "@/components/shop/product-card"

export const metadata: Metadata = {
  title: "School Shop | Sunshine Montessori School",
  description:
    "Shop for school essentials, uniforms, learning materials, and more for your child's Montessori education.",
}

const productCategories = [
  {
    name: "Essentials & Learning Materials",
    products: [
      {
        id: "exercise-books",
        name: "Exercise Books (Pack of 10)",
        price: 25.0,
        image: "/shop-exercise-books.jpg",
        description: "High-quality exercise books with lined pages, perfect for writing practice and assignments.",
        category: "essentials",
      },
      {
        id: "textbooks-primary",
        name: "Primary Textbook Set",
        price: 120.0,
        image: "/shop-textbooks.jpg",
        description: "Complete set of Montessori-aligned textbooks for primary level students.",
        category: "essentials",
      },
      {
        id: "storybooks",
        name: "Storybooks Collection (5 books)",
        price: 45.0,
        image: "/shop-storybooks.jpg",
        description: "Engaging storybooks to develop reading skills and imagination.",
        category: "essentials",
      },
      {
        id: "stationery-set",
        name: "Complete Stationery Set",
        price: 35.0,
        image: "/shop-stationery.jpg",
        description: "Pens, pencils, erasers, rulers, crayons, and markers in a convenient set.",
        category: "essentials",
      },
      {
        id: "art-supplies",
        name: "Art & Craft Supplies Kit",
        price: 55.0,
        image: "/shop-art-supplies.jpg",
        description: "Glue, scissors, colored paper, paints, brushes, and more for creative projects.",
        category: "essentials",
      },
      {
        id: "montessori-materials",
        name: "Montessori Activity Materials",
        price: 85.0,
        image: "/shop-montessori-materials.jpg",
        description: "Authentic Montessori learning materials for home practice and reinforcement.",
        category: "essentials",
      },
    ],
  },
  {
    name: "Uniforms & Clothing",
    products: [
      {
        id: "school-uniform-set",
        name: "Complete School Uniform Set",
        price: 75.0,
        image: "/shop-uniform.jpg",
        description: "Official school uniform including shirt, trousers/skirt, and tie.",
        category: "uniforms",
      },
      {
        id: "pe-kit",
        name: "P.E. Kit / Sportswear",
        price: 40.0,
        image: "/shop-pe-kit.jpg",
        description: "Sports uniform for physical education classes and outdoor activities.",
        category: "uniforms",
      },
      {
        id: "school-shoes",
        name: "School Shoes (Black)",
        price: 60.0,
        image: "/shop-school-shoes.jpg",
        description: "Comfortable black leather school shoes, available in various sizes.",
        category: "uniforms",
      },
      {
        id: "sandals",
        name: "School Sandals",
        price: 35.0,
        image: "/shop-sandals.jpg",
        description: "Comfortable sandals for everyday school wear.",
        category: "uniforms",
      },
      {
        id: "trainers",
        name: "Sports Trainers",
        price: 55.0,
        image: "/shop-trainers.jpg",
        description: "Quality trainers for sports activities and physical education.",
        category: "uniforms",
      },
      {
        id: "school-bag",
        name: "Official School Bag",
        price: 45.0,
        image: "/shop-school-bag.jpg",
        description: "Durable school bag with the school logo and multiple compartments.",
        category: "uniforms",
      },
    ],
  },
  {
    name: "Hygiene & Personal Care",
    products: [
      {
        id: "toiletries-kit",
        name: "Toiletries Kit",
        price: 20.0,
        image: "/shop-toiletries.jpg",
        description: "Toilet rolls, soap, hand sanitizer for school hygiene needs.",
        category: "hygiene",
      },
      {
        id: "tissue-wipes",
        name: "Tissue Boxes & Wipes (Pack of 6)",
        price: 15.0,
        image: "/shop-tissues.jpg",
        description: "Soft tissues and wet wipes for daily hygiene and cleanliness.",
        category: "hygiene",
      },
      {
        id: "diapers-pullups",
        name: "Diapers/Pull-ups (Toddlers)",
        price: 30.0,
        image: "/shop-diapers.jpg",
        description: "High-quality diapers and pull-ups for toddler program students.",
        category: "hygiene",
      },
      {
        id: "nap-mat-set",
        name: "Nap Mat & Bedsheet Set",
        price: 40.0,
        image: "/shop-nap-mat.jpg",
        description: "Comfortable nap mat with bedsheet and pillow for rest time.",
        category: "hygiene",
      },
      {
        id: "handkerchiefs",
        name: "Handkerchiefs & Face Towels (Set of 5)",
        price: 12.0,
        image: "/shop-handkerchiefs.jpg",
        description: "Soft cotton handkerchiefs and face towels for daily use.",
        category: "hygiene",
      },
    ],
  },
  {
    name: "Meals & Feeding",
    products: [
      {
        id: "lunch-box-set",
        name: "Lunch Box & Water Bottle Set",
        price: 25.0,
        image: "/shop-lunch-box.jpg",
        description: "BPA-free lunch box and water bottle with school branding.",
        category: "meals",
      },
      {
        id: "child-cutlery",
        name: "Child-Friendly Cutlery Set",
        price: 15.0,
        image: "/shop-cutlery.jpg",
        description: "Safe, child-sized spoon, fork, and cup for meal times.",
        category: "meals",
      },
      {
        id: "daily-snacks",
        name: "Daily Snacks Package (Weekly)",
        price: 35.0,
        image: "/shop-snacks.jpg",
        description: "Healthy snacks package for one week, including fruits and nutritious treats.",
        category: "meals",
      },
      {
        id: "school-feeding",
        name: "School Feeding Program (Monthly)",
        price: 120.0,
        image: "/shop-school-feeding.jpg",
        description: "Complete monthly school feeding program with balanced, nutritious meals.",
        category: "meals",
      },
    ],
  },
  {
    name: "Transport & Extras",
    products: [
      {
        id: "school-bus-monthly",
        name: "School Bus Service (Monthly)",
        price: 80.0,
        image: "/shop-school-bus.jpg",
        description: "Safe and reliable school bus transportation service for one month.",
        category: "transport",
      },
      {
        id: "field-trip-contribution",
        name: "Field Trip Contribution",
        price: 25.0,
        image: "/shop-field-trip.jpg",
        description: "Contribution towards educational field trips and excursions.",
        category: "extras",
      },
      {
        id: "celebration-items",
        name: "Celebration & Event Items",
        price: 20.0,
        image: "/shop-celebration.jpg",
        description: "Party packs, cultural day costumes, and national day outfits.",
        category: "extras",
      },
      {
        id: "medical-kit",
        name: "Medical/First Aid Kit",
        price: 30.0,
        image: "/shop-medical-kit.jpg",
        description: "Basic first aid supplies and medical kit for school emergencies.",
        category: "extras",
      },
      {
        id: "pta-dues",
        name: "PTA Dues (Termly)",
        price: 50.0,
        image: "/shop-pta.jpg",
        description: "Parent-Teacher Association dues for shared school activities and improvements.",
        category: "extras",
      },
      {
        id: "development-levy",
        name: "School Development Levy",
        price: 100.0,
        image: "/shop-development.jpg",
        description: "Contribution towards school development and maintenance projects.",
        category: "extras",
      },
    ],
  },
]

export default function ShopPage() {
  return (
    <ShopProvider>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-amber-50 to-sage-50 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-serif text-sage-900 mb-6">School Shop</h1>
              <p className="text-xl text-sage-700 leading-relaxed mb-8">
                Everything your child needs for their Montessori education journey. From uniforms and learning materials
                to daily essentials and feeding programs.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Badge className="bg-amber-100 text-amber-800 px-4 py-2">Free Delivery</Badge>
                <Badge className="bg-sage-100 text-sage-800 px-4 py-2">WhatsApp Ordering</Badge>
                <Badge className="bg-stone-100 text-stone-800 px-4 py-2">Quality Guaranteed</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Products by Category */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            {productCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-16">
                <h2 className="text-3xl font-serif text-sage-900 mb-8 text-center">{category.name}</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {category.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Shopping Cart Sidebar */}
        <CartSidebar />
      </div>
    </ShopProvider>
  )
}
