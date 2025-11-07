import { useState, useEffect } from 'react';
import { CategoryChart } from './components/CategoryChart';
import { DifficultyChart } from './components/DifficultyChart';
import { CategoryFilter } from './components/CategoryFilter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Loader2 } from 'lucide-react';

export interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface Category {
  id: number;
  name: string;
}

export interface ChartData {
  name: string;
  value: number;
}

// Helper function to decode HTML entities
export function decodeHTML(html: string): string {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://opentdb.com/api_category.php');
        const data = await response.json();
        setCategories(data.trivia_categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        // Fetch 50 questions from the API
        const response = await fetch('https://opentdb.com/api.php?amount=50');
        const data = await response.json();
        if (data.results) {
          setQuestions(data.results);
          // Select all categories by default on initial load
          if (initialLoad) {
            const allCategories = Array.from(new Set(data.results.map((q: Question) => q.category)));
            setSelectedCategories(allCategories);
            setInitialLoad(false);
          }
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [initialLoad]);

  // Filter questions by selected categories
  const filteredQuestions = questions.filter(q => selectedCategories.includes(q.category));

  // Prepare data for category chart
  const categoryData: ChartData[] = Object.entries(
    filteredQuestions.reduce((acc, question) => {
      const decodedCategory = decodeHTML(question.category);
      acc[decodedCategory] = (acc[decodedCategory] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({
    name: name.replace(/^Entertainment: |^Science: /, ''), // Shorten names
    value
  }));

  // Prepare data for difficulty chart
  const difficultyData: ChartData[] = Object.entries(
    filteredQuestions.reduce((acc, question) => {
      acc[question.difficulty] = (acc[question.difficulty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex">
        {/* Left Sidebar - Category Filter */}
        <div className="w-80 min-h-screen bg-white border-r shadow-sm">
          <div className="p-6">
            <h2 className="mb-4">Categories</h2>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="size-6 animate-spin text-primary" />
              </div>
            ) : (
              <CategoryFilter
                categories={categories}
                questions={questions}
                selectedCategories={selectedCategories}
                onCategoryChange={setSelectedCategories}
              />
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="mb-2">Trivia Survey Visualizer</h1>
              <p className="text-muted-foreground">
                Explore and visualize question distributions from the Open Trivia Database
              </p>
              <div className="flex gap-2 mt-4">
                <Badge variant="secondary">
                  {questions.length} Total Questions
                </Badge>
                <Badge variant="secondary">
                  {selectedCategories.length === 0 ? 'All' : selectedCategories.length} Selected
                </Badge>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="size-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {/* Charts Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Category Distribution Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Questions by Category</CardTitle>
                      <CardDescription>
                        Distribution of {filteredQuestions.length} questions across categories
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CategoryChart data={categoryData} />
                    </CardContent>
                  </Card>

                  {/* Difficulty Distribution Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Questions by Difficulty</CardTitle>
                      <CardDescription>
                        Breakdown of question difficulty levels
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <DifficultyChart data={difficultyData} />
                    </CardContent>
                  </Card>
                </div>

                {/* Question Count Summary */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-muted-foreground">Total Questions</p>
                        <p className="text-2xl">{filteredQuestions.length}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Categories</p>
                        <p className="text-2xl">{categoryData.length}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Easy</p>
                        <p className="text-2xl text-green-600">
                          {filteredQuestions.filter(q => q.difficulty === 'easy').length}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Hard</p>
                        <p className="text-2xl text-red-600">
                          {filteredQuestions.filter(q => q.difficulty === 'hard').length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;