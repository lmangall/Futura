import { Modal } from "./modal";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Principal } from "@dfinity/principal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IDL } from "@dfinity/candid";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { futura_backend } from "../../../../declarations/futura_backend";

const Metadata = IDL.Record({
  file_name: IDL.Text,
  file_type: IDL.Text,
  file_size: IDL.Nat64,
  description: IDL.Opt(IDL.Text),
  date: IDL.Opt(IDL.Text),
  place: IDL.Opt(IDL.Text),
  tags: IDL.Opt(IDL.Vec(IDL.Text)),
  visibility: IDL.Opt(IDL.Vec(IDL.Principal)),
  people: IDL.Opt(IDL.Vec(IDL.Text)),
  preview: IDL.Opt(IDL.Vec(IDL.Nat8)), // blob is represented as Vec<Nat8> in IDL
});

const TextType = IDL.Record({
  id: IDL.Nat64,
  content: IDL.Text,
  metadata: IDL.Opt(Metadata),
});

const ImageType = IDL.Record({
  id: IDL.Nat64,
  content: IDL.Vec(IDL.Nat8),
  metadata: IDL.Opt(Metadata),
});

const SettingsType = IDL.Record({
  language: IDL.Opt(IDL.Text),
  visibility: IDL.Vec(IDL.Principal),
});

const CapsuleMetadata = IDL.Record({
  description: IDL.Opt(IDL.Text),
  creation_date: IDL.Opt(IDL.Text),
  name: IDL.Text,
  id_generator: IDL.Nat64,
});

const CapsuleType = IDL.Record({
  texts: IDL.Opt(IDL.Vec(TextType)),
  images: IDL.Opt(IDL.Vec(ImageType)),
  settings: SettingsType,
  metadata: CapsuleMetadata,
});

type UploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const UploadModal = ({ isOpen, onClose }: UploadModalProps) => {
  if (!isOpen) return null;

  const [selectedType, setSelectedType] = useState<"text" | "image">("text");
  // Metadata fields
  const [imageContent, setImageContent] = useState<number[]>([]); // Add state for imageContent
  const [textContent, setTextContent] = useState<string>(""); // Add state for textContent
  const [fileNemeInput, setfileNemeInput] = useState<string>("example.jpg");
  const [fileTypeInput, setfileTypeInput] = useState<string>("image/jpeg");
  const [fileSizeInput, setfileSizeInput] = useState<bigint>(BigInt(1000));
  const [descriptionInput, setDescriptionInput] = useState<string | null>("An exmple image or an example text.");
  const [date, setDate] = useState<string | null>("2024-10-10");
  const [place, setPlace] = useState<string | null>("Lissabon");
  const [tags, setTags] = useState<string[] | null>(["tag1", "tag2"]);
  const [visibilityInput, setVisibilityInput] = useState<Principal[] | null>([Principal.fromText("aaaaa-aa")]); // Maintain initial state
  const [peopleInput, setPeopleInput] = useState<string[]>([]);
  const [preview, setPreview] = useState<Uint8Array | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      const reader = new FileReader();
      const fileContent = await new Promise<ArrayBuffer>((resolve) => {
        reader.onload = (event) => resolve(event.target?.result as ArrayBuffer);
        reader.readAsArrayBuffer(file);
      });
      const content = Array.from(new Uint8Array(fileContent));
      setImageContent(content); // Set imageContent state
    }

    const metadata = {
      file_name: fileNemeInput,
      file_type: fileTypeInput,
      file_size: fileSizeInput,
      description: descriptionInput ? ([descriptionInput] as [string]) : ([] as []),
      date: date ? ([date] as [string]) : ([] as []),
      place: place ? ([place] as [string]) : ([] as []),
      tags: tags ? ([tags] as [string[]]) : ([] as []),
      visibility: visibilityInput ? ([visibilityInput] as [Principal[]]) : ([] as []),
      people: peopleInput ? ([peopleInput] as [string[]]) : ([[]] as unknown as []),
      preview: preview ? ([Array.from(preview)] as [number[]]) : ([[]] as unknown as []),
    };

    try {
      if (selectedType === "image") {
        const images = [
          {
            id: BigInt(0),
            content: imageContent,
            metadata: metadata,
          },
        ];
        await futura_backend.store_images(images);
      } else if (selectedType === "text") {
        const texts = [
          {
            id: BigInt(0),
            content: textContent, // Change here: Use textContent for the content field
            metadata: metadata,
          },
        ];
        await futura_backend.store_texts(texts);
      }
      setResponse("Upload successful!");
    } catch (error) {
      console.error("Error uploading:", error as Error);
      setResponse(`Failed to upload: ${(error as Error).message}`);
    }
  };

  return (
    <Modal onClose={onClose}>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex space-x-2">
            <Badge
              onClick={() => setSelectedType("text")}
              className={selectedType === "text" ? "bg-blue-500 text-white" : "bg-gray-200"}
            >
              Text
            </Badge>
            <Badge
              onClick={() => setSelectedType("image")}
              className={selectedType === "image" ? "bg-blue-500 text-white" : "bg-gray-200"}
            >
              Image
            </Badge>
          </div>
          <div className="space-y-2 text-sm">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Type your description here."
              value={descriptionInput || ""} // Ensure value is always a string
              onChange={(e) => {
                setDescriptionInput(e.target.value); // Set descriptionInput
                setTextContent(e.target.value); // Also set textContent
              }}
            />
            <Label htmlFor="date" className="text-sm font-medium">
              Date
            </Label>
            <Input id="date" type="date" value={date || ""} onChange={(e) => setDate(e.target.value)} />
            <Label htmlFor="place" className="text-sm font-medium">
              Place
            </Label>
            <Input
              id="place"
              placeholder="Type the place here."
              value={place || ""} // Ensure value is always a string
              onChange={(e) => setPlace(e.target.value)}
            />
            <Label htmlFor="tags" className="text-sm font-medium">
              Tags
            </Label>
            <Input
              id="tags"
              placeholder="Type your tags here, separated by commas."
              value={tags ? tags.join(", ") : ""} // Convert array to string for input display
              onChange={(e) => setTags(e.target.value.split(",").map((tag) => tag.trim()))} // Convert string back to array
            />
            <Label htmlFor="visibility" className="text-sm font-medium">
              Visibility
            </Label>
            <Input
              id="visibility"
              placeholder="Type visibility (e.g., user IDs) here, separated by commas."
              value={visibilityInput ? visibilityInput.map((principal) => principal.toString()).join(", ") : ""} // Convert array to string for input display
              onChange={(e) => {
                const ids = e.target.value.split(",").map((id) => id.trim());
                setVisibilityInput(ids.length > 0 ? ids.map((id) => Principal.fromText(id)) : null); // Convert string back to array of Principals or set to null
              }}
            />
            <Label htmlFor="people" className="text-sm font-medium">
              People
            </Label>
            <Input
              id="people"
              placeholder="Type names or IDs of people here."
              value={peopleInput.join(", ")} // Convert array to string for input display
              onChange={(e) => setPeopleInput(e.target.value.split(",").map((name) => name.trim()))} // Convert string back to array
            />
          </div>
          <div className="space-y-2 text-sm">
            <Label htmlFor="file" className="text-sm font-medium">
              File
            </Label>
            <Input id="file" type="file" placeholder="File" accept="image/*" onChange={handleFileChange} />
          </div>
          {response && <div className="text-sm text-gray-500">{response}</div>}
        </CardContent>
        <CardFooter>
          <Button size="lg" onClick={handleUpload}>
            Upload
          </Button>
        </CardFooter>
      </Card>
    </Modal>
  );
};

export default UploadModal;
