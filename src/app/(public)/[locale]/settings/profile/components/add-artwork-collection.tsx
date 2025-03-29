import { useToast } from "@/hooks/use-toast";
import collectionService from "@/service/collection-service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface AddToCollectionProps {
    artworkId: string;
    collectionId?: string;
    triggerButton?: React.ReactNode;
    onSuccess?: () => void;
}

export default function AddArtworkCollection({ artworkId, collectionId, triggerButton, onSuccess }: AddToCollectionProps) {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState<string>(collectionId || "");
    
    // Query to fetch all collections
    const { data: collections, isLoading: collectionsLoading } = useQuery({
        queryKey: ["collections"],
        queryFn: () => collectionService.getByUserId(),
    });
    
    const mutation = useMutation({
        mutationFn: (data: { artworkId: string; collectionId: string }) => {
            return collectionService.update(data.artworkId, data.collectionId);
        },
        onSuccess: () => {
            toast({
                title: 'Success',
                description: 'Artwork added to collection successfully!',
                className: 'bg-green-500 text-white border-green-600',
                duration: 2000
            });
            setOpen(false);
            if (onSuccess) onSuccess();
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error?.message || 'Failed to add artwork to collection',
                className: 'bg-red-500 text-white border-red-600',
                duration: 2000
            });
        }
    });

    const handleAddToCollection = () => {
        if (!selectedCollection) {
            toast({
                title: 'Warning',
                description: 'Please select a collection',
                className: 'bg-yellow-500 text-white border-yellow-600',
                duration: 2000
            });
            return;
        }
        mutation.mutate({ artworkId, collectionId: selectedCollection });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {triggerButton || <Button variant="outline">Add to Collection</Button>}
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Add to Collection</DialogTitle>
                </DialogHeader>
                
                {collectionsLoading ? (
                    <div className="flex justify-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                ) : collections && collections.length > 0 ? (
                    <>
                        <RadioGroup 
                            value={selectedCollection} 
                            onValueChange={setSelectedCollection}
                            className="space-y-2 my-4"
                        >
                            {collections.map((collection: any) => (
                                <div key={collection.id} className="flex items-center space-x-2 border p-3 rounded-md">
                                    <RadioGroupItem value={collection.id} id={`collection-${collection.id}`} />
                                    <Label htmlFor={`collection-${collection.id}`} className="flex-grow cursor-pointer">
                                        {collection.name}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                        
                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleAddToCollection} 
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Add to Collection
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="py-4 text-center">
                        <p>No collections found. Create a collection first.</p>
                        {/* You could add a button to create a collection here */}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}