import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash2, FileText, Users, MapPin, MessageSquare, Star, Upload, Eye } from 'lucide-react';
import { submissionService, listingService, countryService, subscriptionService, faqService, testimonialService, fileService } from '@/lib/pocketbase-services';
import type { Submission, Listing, Country, Subscription, FAQ, Testimonial } from '@/lib/pocketbase-services';
import CreateForm from './create-form';

export default function CMSAdmin() {
  const [activeTab, setActiveTab] = useState('submissions');
  const [isLoading, setIsLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { toast } = useToast();

  // Data states
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  // Load data for active tab
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      switch (activeTab) {
        case 'submissions':
          const subs = await submissionService.getAll();
          setSubmissions(subs);
          break;
        case 'listings':
          const { listings: listingsData } = await listingService.getAll();
          setListings(listingsData);
          break;
        case 'countries':
          const countriesData = await countryService.getAll();
          setCountries(countriesData);
          break;
        case 'subscriptions':
          const subsData = await subscriptionService.getAll();
          setSubscriptions(subsData);
          break;
        case 'faqs':
          const faqsData = await faqService.getAll();
          setFaqs(faqsData);
          break;
        case 'testimonials':
          const testimonialsData = await testimonialService.getAll();
          setTestimonials(testimonialsData);
          break;
      }
    } catch (error) {
      toast({
        title: "Error loading data",
        description: "Failed to load data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, type: string) => {
    try {
      switch (activeTab) {
        case 'submissions':
          await submissionService.delete(id);
          break;
        case 'listings':
          await listingService.delete(id);
          break;
        case 'countries':
          await countryService.delete(id);
          break;
        case 'subscriptions':
          await subscriptionService.delete(id);
          break;
        case 'faqs':
          await faqService.delete(id);
          break;
        case 'testimonials':
          await testimonialService.delete(id);
          break;
      }
      toast({
        title: "Item deleted",
        description: `${type} deleted successfully`,
      });
      loadData();
    } catch (error) {
      toast({
        title: "Error deleting item",
        description: "Failed to delete item. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleStatusUpdate = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
    try {
      await submissionService.updateStatus(id, status);
      toast({
        title: "Status updated",
        description: `Submission ${status} successfully`,
      });
      loadData();
    } catch (error) {
      toast({
        title: "Error updating status",
        description: "Failed to update status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const renderSubmissions = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Submissions Management</h3>
        <CreateForm type="submissions" onSuccess={loadData} />
      </div>
      
      <div className="grid gap-4">
        {submissions.map((submission) => (
          <Card key={submission.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{submission.name}</CardTitle>
                  <p className="text-sm text-gray-600">{submission.submittedByEmail}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={
                    submission.status === 'approved' ? 'default' :
                    submission.status === 'pending' ? 'secondary' : 'destructive'
                  }>
                    {submission.status}
                  </Badge>
                  <Select value={submission.status} onValueChange={(value) => handleStatusUpdate(submission.id, value as any)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><strong>Website:</strong> <a href={submission.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{submission.website}</a></p>
                  <p><strong>Listings:</strong> {submission.listingCount}</p>
                  <p><strong>Countries:</strong> {submission.countries.join(', ')}</p>
                </div>
                <div>
                  <p><strong>Listing Type:</strong> {submission.listingType}</p>
                  <p><strong>Description:</strong> {submission.oneLineDescription}</p>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => setEditingItem(submission)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Submission</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this submission? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(submission.id, 'Submission')}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderListings = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Listings Management</h3>
        <CreateForm type="listings" onSuccess={loadData} />
      </div>
      
      <div className="grid gap-4">
        {listings.map((listing) => (
          <Card key={listing.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{listing.name}</CardTitle>
                  <p className="text-sm text-gray-600">{listing.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={listing.featured ? 'default' : 'secondary'}>
                    {listing.featured ? 'Featured' : 'Regular'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><strong>Website:</strong> <a href={listing.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{listing.website}</a></p>
                  <p><strong>Countries:</strong> {listing.countries.join(', ')}</p>
                </div>
                <div>
                  {listing.logo && (
                    <div>
                      <strong>Logo:</strong>
                      <img src={listing.logo} alt="Logo" className="w-16 h-16 object-cover rounded mt-1" />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => setEditingItem(listing)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Listing</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this listing? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(listing.id, 'Listing')}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderCountries = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Countries Management</h3>
        <CreateForm type="countries" onSuccess={loadData} />
      </div>
      
      <div className="grid gap-4">
        {countries.map((country) => (
          <Card key={country.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">{country.name}</h4>
                  <p className="text-sm text-gray-600">Code: {country.code}</p>
                  <p className="text-sm text-gray-600">Slug: {country.slug}</p>
                  <p className="text-sm text-gray-600">Listings: {country.listingCount}</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingItem(country)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Country</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this country? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(country.id, 'Country')}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSubscriptions = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Newsletter Subscriptions</h3>
        <span className="text-sm text-gray-600">Total: {subscriptions.length}</span>
      </div>
      
      <div className="grid gap-4">
        {subscriptions.map((subscription) => (
          <Card key={subscription.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">{subscription.email}</h4>
                  <p className="text-sm text-gray-600">Subscribed: {new Date(subscription.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex space-x-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Subscription</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this subscription? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(subscription.id, 'Subscription')}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderFAQs = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">FAQ Management</h3>
        <CreateForm type="faqs" onSuccess={loadData} />
      </div>
      
      <div className="grid gap-4">
        {faqs.map((faq) => (
          <Card key={faq.id}>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold">{faq.question}</h4>
                    <p className="text-sm text-gray-600 mt-1">{faq.answer}</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Badge variant={faq.category === 'traveler' ? 'default' : 'secondary'}>
                      {faq.category}
                    </Badge>
                    <span className="text-xs text-gray-500">Order: {faq.order}</span>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => setEditingItem(faq)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete FAQ</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this FAQ? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(faq.id, 'FAQ')}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderTestimonials = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Testimonials Management</h3>
        <CreateForm type="testimonials" onSuccess={loadData} />
      </div>
      
      <div className="grid gap-4">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{testimonial.role} at {testimonial.company}</p>
                  <p className="text-sm">{testimonial.content}</p>
                </div>
                <div className="flex space-x-2 ml-4">
                  <Button variant="outline" size="sm" onClick={() => setEditingItem(testimonial)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Testimonial</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this testimonial? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(testimonial.id, 'Testimonial')}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">BookDirectStays CMS</h1>
          <p className="text-gray-600 mt-2">Manage your website content and data</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="submissions" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Submissions
            </TabsTrigger>
            <TabsTrigger value="listings" className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Listings
            </TabsTrigger>
            <TabsTrigger value="countries" className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Countries
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Subscriptions
            </TabsTrigger>
            <TabsTrigger value="faqs" className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              FAQs
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="flex items-center">
              <Star className="h-4 w-4 mr-2" />
              Testimonials
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                <TabsContent value="submissions">{renderSubmissions()}</TabsContent>
                <TabsContent value="listings">{renderListings()}</TabsContent>
                <TabsContent value="countries">{renderCountries()}</TabsContent>
                <TabsContent value="subscriptions">{renderSubscriptions()}</TabsContent>
                <TabsContent value="faqs">{renderFAQs()}</TabsContent>
                <TabsContent value="testimonials">{renderTestimonials()}</TabsContent>
              </>
            )}
          </div>
        </Tabs>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{submissions.length}</div>
              <p className="text-xs text-gray-600">Submissions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{listings.length}</div>
              <p className="text-xs text-gray-600">Listings</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{countries.length}</div>
              <p className="text-xs text-gray-600">Countries</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{subscriptions.length}</div>
              <p className="text-xs text-gray-600">Subscriptions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{faqs.length}</div>
              <p className="text-xs text-gray-600">FAQs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{testimonials.length}</div>
              <p className="text-xs text-gray-600">Testimonials</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 