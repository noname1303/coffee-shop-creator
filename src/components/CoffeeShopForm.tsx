
import React, { useState } from "react";
import { PriceRange, CoffeeShopStyle } from "@/types";
import { addCoffeeShop } from "@/lib/coffeeShops";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Coffee, MapPin, DollarSign, Plus, Image, PaintBucket, Check, X, Upload, Trash } from "lucide-react";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

interface CoffeeShopFormProps {
  onSuccess: () => void;
}

// Temporary data for styles - will be replaced with Supabase data
const INITIAL_STYLES = [
  { id: "1", name: "Modern" },
  { id: "2", name: "Vintage" },
  { id: "3", name: "Industrial" },
  { id: "4", name: "Cozy" },
];

const CoffeeShopForm: React.FC<CoffeeShopFormProps> = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [priceRange, setPriceRange] = useState<PriceRange>(PriceRange.MODERATE);
  const [selectedStyles, setSelectedStyles] = useState<CoffeeShopStyle[]>([]);
  const [styles, setStyles] = useState(INITIAL_STYLES);
  const [newStyle, setNewStyle] = useState("");
  const [isCreatingStyle, setIsCreatingStyle] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openStylePopover, setOpenStylePopover] = useState(false);
  
  // Validation states
  const [nameError, setNameError] = useState("");
  const [addressError, setAddressError] = useState("");
  
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setImages((prevImages) => [...prevImages, ...selectedFiles]);
      
      // Create previews for all selected files
      selectedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          setImagePreviews((prevPreviews) => [
            ...prevPreviews,
            event.target?.result as string
          ]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleCreateStyle = () => {
    if (!newStyle.trim()) return;
    
    // Create a new style with a temporary ID
    const tempId = `new-${Date.now()}`;
    const createdStyle = { id: tempId, name: newStyle.trim() };
    
    setStyles([...styles, createdStyle]);
    // Add to selected styles too
    setSelectedStyles([...selectedStyles, createdStyle]);
    setNewStyle("");
    setIsCreatingStyle(false);
    toast.success(`Added new style: ${newStyle.trim()}`);
  };

  const handleToggleStyle = (style: CoffeeShopStyle) => {
    const isSelected = selectedStyles.some(s => s.id === style.id);
    
    if (isSelected) {
      // Remove style if already selected
      setSelectedStyles(selectedStyles.filter(s => s.id !== style.id));
    } else {
      // Add style if not already selected
      setSelectedStyles([...selectedStyles, style]);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setNameError("");
    setAddressError("");
    
    // Validate
    let isValid = true;
    
    if (!name.trim()) {
      setNameError("Name is required");
      isValid = false;
    }
    
    if (!address.trim()) {
      setAddressError("Address is required");
      isValid = false;
    }
    
    if (!isValid) return;
    
    setIsSubmitting(true);
    
    try {
      // When Supabase is connected, we'll upload the images and save to database
      addCoffeeShop({
        name: name.trim(),
        address: address.trim(),
        priceRange,
        styles: selectedStyles,
        // imageUrls will be added after Supabase integration
      });
      
      // Clear form
      setName("");
      setAddress("");
      setPriceRange(PriceRange.MODERATE);
      setSelectedStyles([]);
      setImages([]);
      setImagePreviews([]);
      onSuccess();
    } catch (error) {
      console.error("Error adding coffee shop:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="glass-card animate-scale-in">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Add New Coffee Shop</span>
          <Coffee className="h-5 w-5 text-primary" />
        </CardTitle>
        <CardDescription>
          Fill in the details to add a new coffee shop to your catalog.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-1.5">
              <Coffee className="h-3.5 w-3.5" />
              Shop Name
            </Label>
            <Input
              id="name"
              placeholder="e.g. Minimal Brew"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`glass-input transition-all ${nameError ? 'border-destructive' : ''}`}
            />
            {nameError && <p className="text-xs text-destructive">{nameError}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              Address
            </Label>
            <Input
              id="address"
              placeholder="e.g. 123 Simplicity Ave, Design District"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`glass-input transition-all ${addressError ? 'border-destructive' : ''}`}
            />
            {addressError && <p className="text-xs text-destructive">{addressError}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="priceRange" className="flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5" />
              Price Range
            </Label>
            <Select
              value={priceRange}
              onValueChange={(value) => setPriceRange(value as PriceRange)}
            >
              <SelectTrigger id="priceRange" className="glass-input">
                <SelectValue placeholder="Select a price range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PriceRange.BUDGET}>$ (Budget)</SelectItem>
                <SelectItem value={PriceRange.MODERATE}>$$ (Moderate)</SelectItem>
                <SelectItem value={PriceRange.EXPENSIVE}>$$$ (Expensive)</SelectItem>
                <SelectItem value={PriceRange.PREMIUM}>$$$$ (Premium)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="style" className="flex items-center gap-1.5">
              <PaintBucket className="h-3.5 w-3.5" />
              Shop Styles
            </Label>
            <Popover open={openStylePopover} onOpenChange={setOpenStylePopover}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={`w-full justify-between glass-input ${selectedStyles.length === 0 ? 'text-muted-foreground' : ''}`}
                >
                  {selectedStyles.length === 0 
                    ? "Select styles..." 
                    : `${selectedStyles.length} style${selectedStyles.length > 1 ? 's' : ''} selected`}
                  <DollarSign className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search style..." />
                  <CommandList>
                    <CommandEmpty>
                      {isCreatingStyle ? (
                        <div className="flex items-center p-2">
                          <Input
                            value={newStyle}
                            onChange={(e) => setNewStyle(e.target.value)}
                            placeholder="Enter new style name"
                            className="flex-1"
                            autoFocus
                          />
                          <Button 
                            onClick={handleCreateStyle}
                            size="sm"
                            className="ml-2"
                          >
                            Add
                          </Button>
                        </div>
                      ) : (
                        <div className="p-2 text-center">
                          <p>No style found.</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => setIsCreatingStyle(true)}
                          >
                            Create new style
                          </Button>
                        </div>
                      )}
                    </CommandEmpty>
                    <CommandGroup>
                      {styles.map((style) => (
                        <CommandItem
                          key={style.id}
                          value={style.name}
                          onSelect={() => handleToggleStyle(style)}
                        >
                          <div className="flex items-center">
                            <div className={`mr-2 h-4 w-4 flex items-center justify-center ${
                              selectedStyles.some(s => s.id === style.id) 
                                ? "text-primary" 
                                : "opacity-0"
                            }`}>
                              <Check className="h-4 w-4" />
                            </div>
                            {style.name}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <CommandGroup>
                      <CommandItem onSelect={() => setIsCreatingStyle(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create new style
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            
            {/* Display selected styles as badges */}
            {selectedStyles.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedStyles.map(style => (
                  <div 
                    key={style.id}
                    className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs flex items-center gap-1"
                  >
                    {style.name}
                    <button 
                      type="button" 
                      onClick={() => handleToggleStyle(style)}
                      className="text-secondary-foreground/70 hover:text-secondary-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="images" className="flex items-center gap-1.5">
              <Image className="h-3.5 w-3.5" />
              Shop Images
            </Label>
            
            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square rounded-md overflow-hidden border border-border">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 rounded-full"
                      onClick={() => removeImage(index)}
                    >
                      <span className="sr-only">Remove image</span>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Upload Button */}
            <div className="w-full">
              <div 
                className="flex justify-center items-center border-2 border-dashed border-border rounded-md h-40 bg-background/50 cursor-pointer hover:bg-background/80 transition-colors"
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                <div className="text-center p-4">
                  <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Click to upload images
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG up to 5MB each
                  </p>
                  <p className="text-xs font-medium mt-2">
                    {images.length} {images.length === 1 ? 'image' : 'images'} selected
                  </p>
                </div>
              </div>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImagesChange}
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full group transition-all hover:shadow-md" 
            disabled={isSubmitting}
          >
            <Plus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
            {isSubmitting ? "Adding..." : "Add Coffee Shop"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CoffeeShopForm;
