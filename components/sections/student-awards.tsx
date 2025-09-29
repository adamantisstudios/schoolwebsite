import { Trophy, Award, BookOpen } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const topStudents = [
  {
    rank: 1,
    name: "Ama Asante",
    age: 6,
    program: "Primary Program",
    achievements: [
      "Outstanding Academic Performance",
      "Leadership in Practical Life Activities",
      "Exceptional Peer Mentoring",
      "Creative Problem Solving",
    ],
    prizes: [
      "3 Educational Books Collection",
      "GHS 300 Cash Prize",
      "30% Tuition Fee Discount",
      "Student of the Year Certificate",
    ],
    image: "/student-ama-asante.jpg",
    quote: "Learning is like playing - when you love what you do, you become the best at it!",
  },
  {
    rank: 2,
    name: "Kwame Osei",
    age: 5,
    program: "Primary Program",
    achievements: ["Mathematics Excellence", "Environmental Stewardship", "Community Service Leadership"],
    prizes: ["2 Educational Books", "GHS 200 Cash Prize", "20% Tuition Fee Discount"],
    image: "/student-kwame-osei.jpg",
  },
  {
    rank: 3,
    name: "Akosua Mensah",
    age: 4,
    program: "Primary Program",
    achievements: ["Language Arts Proficiency", "Cultural Studies Excellence", "Artistic Expression"],
    prizes: ["1 Educational Book Set", "GHS 100 Cash Prize", "15% Tuition Fee Discount"],
    image: "/student-akosua-mensah.jpg",
  },
]

export default function StudentAwards() {
  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="h-8 w-8 text-amber-600" />
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
              Semester Awards
            </Badge>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Best Overall Students of the Semester
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto text-balance">
            Celebrating our exceptional students who embody the Montessori spirit of curiosity, independence, and
            academic excellence.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {topStudents.map((student, index) => (
            <Card
              key={student.name}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                student.rank === 1 ? "ring-2 ring-amber-400 transform md:-translate-y-4" : ""
              }`}
            >
              {student.rank === 1 && (
                <div className="absolute top-0 right-0 bg-amber-500 text-white px-3 py-1 text-sm font-semibold rounded-bl-lg">
                  🏆 Winner
                </div>
              )}

              <div className="relative">
                <img
                  src={student.image || "/placeholder.svg"}
                  alt={student.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-white/90 text-gray-800">
                    Rank #{student.rank}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <h3 className="font-serif text-xl font-bold text-gray-900 mb-1">{student.name}</h3>
                  <p className="text-gray-600">
                    Age {student.age} • {student.program}
                  </p>
                  {student.quote && (
                    <blockquote className="text-sm text-gray-500 italic mt-2 text-balance">
                      "{student.quote}"
                    </blockquote>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Award className="h-4 w-4 text-amber-600" />
                      Achievements
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {student.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-600 mt-1">•</span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-amber-600" />
                      Prizes Won
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {student.prizes.map((prize, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-600 mt-1">•</span>
                          {prize}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Awards are given based on academic excellence, character development, and community contribution.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Academic Excellence
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Character Development
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Community Leadership
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
