import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Plus } from 'lucide-react';
import { submissionService, listingService, countryService, faqService, testimonialService } from '@/lib/pocketbase-services';

interface CreateFormProps {
  type: 'submissions' | 'listings' | 'countries' | 'faqs' | 'testimonials';
  onSuccess: () => void;
}

export default function CreateForm({ type, onSuccess }: CreateFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Add creation logic here based on type
      // This would integrate with your existing services
      
      toast({
        title: "Success",
        description: "Item created successfully",
      });
      
      setIsOpen(false);
      setFormData({});
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create item. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderFields = () => {
    switch (type) {
      case 'countries':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Country Name</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter country name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Country Code</Label>
              <Input
                id="code"
                value={formData.code || ''}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                placeholder="US, CA, UK, etc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug || ''}
                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                placeholder="country-slug"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="listingCount">Listing Count</Label>
              <Input
                id="listingCount"
                type="number"
                value={formData.listingCount || ''}
                onChange={(e) => setFormData({...formData, listingCount: parseInt(e.target.value) || 0})}
                placeholder="0"
              />
            </div>
          </>
        );
      
      case 'faqs':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                value={formData.question || ''}
                onChange={(e) => setFormData({...formData, question: e.target.value})}
                placeholder="Enter FAQ question"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="answer">Answer</Label>
              <Textarea
                id="answer"
                value={formData.answer || ''}
                onChange={(e) => setFormData({...formData, answer: e.target.value})}
                placeholder="Enter FAQ answer"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category || ''} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="traveler">Traveler</SelectItem>
                  <SelectItem value="host">Host</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order || ''}
                onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                placeholder="0"
              />
            </div>
          </>
        );
      
      case 'testimonials':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={formData.role || ''}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                placeholder="Enter role"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company || ''}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                placeholder="Enter company"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content || ''}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="Enter testimonial content"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <Select value={formData.rating?.toString() || ''} onValueChange={(value) => setFormData({...formData, rating: parseInt(value)})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Star</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      
      case 'listings':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter listing name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website || ''}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="countries">Countries (comma-separated)</Label>
              <Input
                id="countries"
                value={formData.countries || ''}
                onChange={(e) => setFormData({...formData, countries: e.target.value.split(',').map(c => c.trim())})}
                placeholder="US, CA, UK"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="featured"
                type="checkbox"
                checked={formData.featured || false}
                onChange={(e) => setFormData({...formData, featured: e.target.checked})}
              />
              <Label htmlFor="featured">Featured</Label>
            </div>
          </>
        );
      
      default:
        return (
          <div className="space-y-2">
            <Label>Form</Label>
            <p className="text-sm text-gray-600">Create form for {type} is not implemented yet.</p>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add {type.slice(0, -1).charAt(0).toUpperCase() + type.slice(1, -1)}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New {type.slice(0, -1).charAt(0).toUpperCase() + type.slice(1, -1)}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderFields()}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 