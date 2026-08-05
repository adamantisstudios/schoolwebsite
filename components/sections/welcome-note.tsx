export default function WelcomeNote() {
  return (
    <section className="py-20 bg-gradient-to-br from-sage-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/images/schoolmistress.jpg?height=400&width=400"
                alt="School Manager"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-amber-200 rounded-full opacity-60" />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-sage-200 rounded-full opacity-40" />
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-sage-900 mb-4 text-balance">
                A Personal Welcome from Our School Manager
              </h2>
              <div className="w-16 h-1 bg-amber-500 rounded-full" />
            </div>

            <div className="space-y-4 text-sage-700 leading-relaxed">
              <p className="text-lg">
                "Welcome to Montessori Bloom School, where every child's unique potential is nurtured and celebrated. As
                the School Manager, I am deeply committed to creating an environment where children can flourish
                academically, socially, and emotionally."
              </p>

              <p>
                "Our dedicated team of Montessori-trained educators works tirelessly to provide authentic,
                child-centered learning experiences that foster independence, creativity, and a lifelong love of
                learning. We believe that education is not just about academic achievement, but about developing
                confident, compassionate, and capable individuals."
              </p>

              <p>
                "I invite you to visit our campus and experience firsthand the joy and wonder that fills our classrooms
                every day. Together, we can help your child bloom into their fullest potential."
              </p>
            </div>

            <div className="pt-4">
              <div className="space-y-1">
                <h4 className="font-semibold text-sage-900 text-lg">Mrs. Akosua Mensah</h4>
                <p className="text-sage-600">School Manager & Educational Director</p>
                <p className="text-sm text-sage-500">M.Ed. Early Childhood Education, AMI Montessori Diploma</p>
              </div>
            </div>

            <div className="pt-6">
              <a
                href="/schedule-tour"
                className="inline-flex items-center px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Schedule a Personal Tour
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
