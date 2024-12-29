import { ArtPiece } from "@/types/marketplace";

function getRandomSize() {
  const sizes = [
    { width: 300, height: 200 },
    { width: 400, height: 300 },
    { width: 500, height: 400 },
    { width: 600, height: 400 },
    { width: 400, height: 600 },
  ];
  return sizes[Math.floor(Math.random() * sizes.length)];
}

const mockArtPieces: ArtPiece[] = Array.from({ length: 100 }, (_, i) => {
  const { width, height } = getRandomSize();
  return {
    id: `art-${i + 1}`,
    title: `Artwork ${i + 1}`,
    artist: `Artist ${i + 1}`,
    imageUrl: `/images/demo.jpg?height=${height}&width=${width}`,
    price: Math.floor(Math.random() * 1000) + 100,
    description: `
    Cupidatat anim officia adipisicing magna laborum ut pariatur proident in amet dolore. Quis in proident excepteur nisi elit ipsum consectetur nisi et ullamco incididunt labore consequat nulla. Est et irure veniam cillum anim quis mollit laboris in. Fugiat proident velit cillum excepteur dolor nisi excepteur tempor velit elit deserunt eu id.
    Duis do cillum fugiat et culpa irure cillum cillum pariatur. Nulla elit eu pariatur magna laborum in. Ex ipsum nulla velit incididunt tempor ipsum enim laborum excepteur adipisicing eu in. Officia proident cillum velit do ut cupidatat laboris officia aliquip. Qui excepteur minim veniam ea ullamco.
    Dolore eu est fugiat non ea quis veniam esse in nisi non. Ea voluptate minim aliqua eiusmod culpa magna minim in. Minim aliqua pariatur fugiat eiusmod cillum aliquip amet quis. Nisi et exercitation consequat aliqua. Est ea incididunt incididunt eiusmod amet laborum quis incididunt eiusmod ullamco esse. Cupidatat aliqua tempor amet consectetur commodo consequat velit esse. Ad esse cupidatat velit incididunt laboris.
    Laboris eiusmod nulla duis aliquip eu mollit velit. Consectetur aliquip velit est sint ex irure laboris enim do minim labore. Ex est sit occaecat consequat amet pariatur sunt ea incididunt minim amet laboris qui ex. Et est reprehenderit duis dolore reprehenderit amet voluptate veniam velit et occaecat incididunt. Cillum sint est Lorem exercitation Lorem sit esse culpa quis. Amet esse excepteur consequat reprehenderit ex eiusmod velit incididunt ad veniam veniam. Consequat adipisicing et tempor culpa ad elit ullamco culpa minim ex cillum minim.
    Anim sit ullamco cupidatat duis non laboris labore. Enim nostrud eiusmod laborum aliqua officia. Dolor in officia deserunt amet fugiat duis pariatur tempor.
    ${i + 1}.`,
    width,
    height,
  };
});

export async function fetchArtPieces(
  page: number,
  limit: number
): Promise<ArtPiece[]> {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
  return mockArtPieces.slice((page - 1) * limit, page * limit);
}

export async function fetchArtPieceById(): Promise<ArtPiece> {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
  // trả về 1 artPiece
  return mockArtPieces[0];
}

export async function purchaseArt(
  artId: string
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
  return {
    success: true,
    message: `Successfully purchased artwork with ID: ${artId}`,
  };
}
