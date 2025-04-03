import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import collectionService from "@/service/collection-service";
import { Button } from "../ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Loader2 } from "lucide-react";

interface AddArtworktProps {
    artworkId: string;
    triggerButton?: React.ReactNode;
    onSuccess?: () => void;
}

export default function AddArtworkCollection({artworkId, triggerButton, onSuccess}: AddArtworktProps) {
    const { toast } = useToast();   
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCollectionId, setSellectedCollectionId] = useState<string>("");
    
    // Fetch user collections
    const { data: { data: collections } = { data: [] }, isLoading } = useQuery({
        queryKey: ['collections'],
        queryFn: () => collectionService.getByUserId(),
    });
    
    const mutation = useMutation({
        mutationFn: (collectionId: string) => collectionService.update(collectionId, artworkId),
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Artwork added to collection successfully",
                className: 'bg-green-500 text-white border-green-600'
            });
            
            setIsOpen(false);
            
            if (onSuccess) {
                onSuccess();
            }
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to add artwork to collection",
                className: 'bg-red-500 text-white border-red-600'
            });
        }
    });

    const handleAddToCollection = (collectionId: string) => {
        // Check if artwork already exists in the selected collection
        const selectedCollection = collections?.find(
            (collection: any) => collection._id === collectionId
        );
        
        if (selectedCollection && selectedCollection.artworks) {
            const artworkExists = selectedCollection.artworks.some(
                (artwork: any) => artwork._id === artworkId
            );
            
            if (artworkExists) {
                toast({
                    title: "Already in collection",
                    description: `This artwork is already in the "${selectedCollection.title}" collection`,
                    className: 'bg-blue-500 text-white border-blue-600'
                });
                return;
            }
        }
        
        setSellectedCollectionId(collectionId);
        mutation.mutate(collectionId);
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {triggerButton ? (
                    <div>
                        {triggerButton}
                    </div>
                ) : (
                    <Button>
                        Add to Collection
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add to Collection</DialogTitle>
                </DialogHeader>
                
                <div className="py-4">
                    {isLoading ? (
                        <div className="flex justify-center py-4">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                    ) : collections && collections.length > 0 ? (
                        <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
                            {collections.map((collection: any) => (
                                <div 
                                    key={collection._id}
                                    className={`p-3 border rounded-md cursor-pointer hover:bg-secondary transition-colors ${
                                        mutation.isPending && selectedCollectionId === collection._id ? 'opacity-70' : ''
                                    }`}
                                    onClick={() => {
                                        handleAddToCollection(collection._id);
                                    }}
                                >
                                    <div className="font-medium">{collection.title}</div>
                                    {collection.description && (
                                        <div className="text-sm text-muted-foreground line-clamp-1">
                                            {collection.description}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p>You don't have any collections yet.</p>
                            <Button 
                                variant="link" 
                                className="mt-2"
                                onClick={() => setIsOpen(false)}
                            >
                                Create a collection first
                            </Button>
                        </div>
                    )}
                </div>
                
                {mutation.isPending && (
                    <div className="flex items-center justify-center gap-2 text-sm">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Adding artwork to collection...</span>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}