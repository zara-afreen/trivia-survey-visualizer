import { Category, Question, decodeHTML } from '../App';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';

interface CategoryFilterProps {
  categories: Category[];
  questions: Question[];
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
}

export function CategoryFilter({ 
  categories, 
  questions, 
  selectedCategories, 
  onCategoryChange 
}: CategoryFilterProps) {
  // Count questions per category
  const categoryCounts = questions.reduce((acc, question) => {
    acc[question.category] = (acc[question.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get unique categories from questions
  const availableCategories = Array.from(new Set(questions.map(q => q.category)));

  const handleToggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const handleSelectAll = () => {
    if (selectedCategories.length === availableCategories.length) {
      // Deselect all
      onCategoryChange([]);
    } else {
      // Select all
      onCategoryChange(availableCategories);
    }
  };

  const allSelected = selectedCategories.length === availableCategories.length;

  return (
    <div className="space-y-4">
      {/* Select All Button */}
      <div 
        onClick={handleSelectAll}
        className="flex items-center gap-2 p-3 rounded-lg border hover:bg-gray-100 transition-colors cursor-pointer"
      >
        <Checkbox 
          checked={allSelected}
        />
        <span className="flex-1">All Categories</span>
        <Badge variant="secondary">
          {questions.length}
        </Badge>
      </div>

      {/* Category List */}
      <div className="space-y-2 max-h-[calc(100vh-240px)] overflow-y-auto pr-2">
        {availableCategories.sort().map((category) => {
          const decodedCategory = decodeHTML(category);
          const displayName = decodedCategory.replace(/^Entertainment: |^Science: /, '');
          const isChecked = selectedCategories.includes(category);
          
          return (
            <div
              key={category}
              onClick={() => handleToggleCategory(category)}
              className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <Checkbox checked={isChecked} />
              <span className="flex-1 text-sm">{displayName}</span>
              <Badge variant="secondary">
                {categoryCounts[category]}
              </Badge>
            </div>
          );
        })}
      </div>

      {/* Clear Selection */}
      {selectedCategories.length > 0 && (
        <Button 
          variant="ghost" 
          className="w-full"
          onClick={() => onCategoryChange([])}
        >
          Clear Selection
        </Button>
      )}
    </div>
  );
}