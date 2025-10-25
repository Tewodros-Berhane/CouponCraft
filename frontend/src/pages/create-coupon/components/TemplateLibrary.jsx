import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TemplateLibrary = ({ selectedTemplate, onTemplateSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const templateCategories = [
    { id: 'all', name: 'All Templates', icon: 'Grid3X3' },
    { id: 'restaurant', name: 'Restaurant', icon: 'UtensilsCrossed' },
    { id: 'retail', name: 'Retail', icon: 'ShoppingBag' },
    { id: 'beauty', name: 'Beauty & Spa', icon: 'Sparkles' },
    { id: 'fitness', name: 'Fitness', icon: 'Dumbbell' },
    { id: 'automotive', name: 'Automotive', icon: 'Car' },
    { id: 'services', name: 'Services', icon: 'Wrench' }
  ];

  const couponTemplates = [
    {
      id: 'template-1',
      name: 'Classic Discount',
      category: 'all',
      thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop',
      description: 'Clean and professional design perfect for any business',
      colors: ['#1e40af', '#ffffff', '#f8fafc'],
      isPopular: true
    },
    {
      id: 'template-2',
      name: 'Food Special',
      category: 'restaurant',
      thumbnail: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=300&h=200&fit=crop',
      description: 'Appetizing design for restaurants and food services',
      colors: ['#dc2626', '#ffffff', '#fef2f2'],
      isPopular: false
    },
    {
      id: 'template-3',
      name: 'Shopping Spree',
      category: 'retail',
      thumbnail: 'https://images.pixabay.com/photo/2017/12/26/09/15/woman-3040029_1280.jpg?w=300&h=200&fit=crop',
      description: 'Vibrant retail-focused design for stores and boutiques',
      colors: ['#7c3aed', '#ffffff', '#f3f4f6'],
      isPopular: true
    },
    {
      id: 'template-4',
      name: 'Spa Relaxation',
      category: 'beauty',
      thumbnail: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300&h=200&fit=crop',
      description: 'Calming design for beauty salons and spas',
      colors: ['#059669', '#ffffff', '#ecfdf5'],
      isPopular: false
    },
    {
      id: 'template-5',
      name: 'Fitness Power',
      category: 'fitness',
      thumbnail: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?w=300&h=200&fit=crop',
      description: 'Energetic design for gyms and fitness centers',
      colors: ['#ea580c', '#ffffff', '#fff7ed'],
      isPopular: false
    },
    {
      id: 'template-6',
      name: 'Auto Service',
      category: 'automotive',
      thumbnail: 'https://images.pixabay.com/photo/2016/11/19/12/35/automotive-1839764_1280.jpg?w=300&h=200&fit=crop',
      description: 'Professional design for automotive services',
      colors: ['#1f2937', '#ffffff', '#f9fafb'],
      isPopular: false
    },
    {
      id: 'template-7',
      name: 'Service Pro',
      category: 'services',
      thumbnail: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=200&fit=crop',
      description: 'Trustworthy design for professional services',
      colors: ['#0f766e', '#ffffff', '#f0fdfa'],
      isPopular: true
    },
    {
      id: 'template-8',
      name: 'Modern Minimal',
      category: 'all',
      thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?w=300&h=200&fit=crop',
      description: 'Sleek minimal design for contemporary businesses',
      colors: ['#374151', '#ffffff', '#f3f4f6'],
      isPopular: false
    }
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? couponTemplates 
    : couponTemplates?.filter(template => template?.category === selectedCategory || template?.category === 'all');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Choose Template</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Select a design that matches your business style
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Palette" size={16} />
          <span>{filteredTemplates?.length} templates</span>
        </div>
      </div>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {templateCategories?.map((category) => (
          <button
            key={category?.id}
            onClick={() => setSelectedCategory(category?.id)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 hover-scale ${
              selectedCategory === category?.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
            }`}
          >
            <Icon name={category?.icon} size={16} />
            <span>{category?.name}</span>
          </button>
        ))}
      </div>
      {/* Template Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates?.map((template) => (
          <div
            key={template?.id}
            onClick={() => onTemplateSelect(template)}
            className={`relative group cursor-pointer rounded-xl border-2 transition-all duration-200 hover-scale ${
              selectedTemplate?.id === template?.id
                ? 'border-primary shadow-level-2'
                : 'border-border hover:border-primary/50 hover:shadow-level-1'
            }`}
          >
            {/* Popular Badge */}
            {template?.isPopular && (
              <div className="absolute top-3 right-3 z-10 bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-medium">
                Popular
              </div>
            )}

            {/* Template Preview */}
            <div className="aspect-[3/2] overflow-hidden rounded-t-xl">
              <Image
                src={template?.thumbnail}
                alt={template?.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Template Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {template?.name}
                </h4>
                {selectedTemplate?.id === template?.id && (
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="Check" size={12} color="white" />
                  </div>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {template?.description}
              </p>

              {/* Color Palette */}
              <div className="flex items-center space-x-1">
                <span className="text-xs text-muted-foreground mr-2">Colors:</span>
                {template?.colors?.map((color, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-full border border-border"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-level-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
                <span className="text-sm font-medium text-foreground">Select Template</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Empty State */}
      {filteredTemplates?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h4 className="text-lg font-medium text-foreground mb-2">No templates found</h4>
          <p className="text-muted-foreground">
            Try selecting a different category or browse all templates
          </p>
        </div>
      )}
    </div>
  );
};

export default TemplateLibrary;