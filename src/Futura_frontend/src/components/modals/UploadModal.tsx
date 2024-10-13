import { Modal } from "./modal";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IDL } from "@dfinity/candid";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { futura_backend } from "../../../../declarations/futura_backend";

const CapsuleType = IDL.Record({
  texts: IDL.Opt(IDL.Vec(TextType)),
  images: IDL.Opt(IDL.Vec(ImageType)),
  settings: IDL.SettingsType,
  metadata: IDL.CapsuleMetadata,
});

const SettingsType = IDL.Record({
  language: IDL.Opt(IDL.Text),
  visibility: IDL.Vec(IDL.Principal),
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

const CapsuleMetadata = IDL.Record({
  description: IDL.Opt(IDL.Text),
  creation_date: IDL.Opt(IDL.Text),
  name: IDL.Text,
  id_generator: IDL.nat64,
});

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

const UploadModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [selectedType, setSelectedType] = useState<"text" | "image">("text");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [place, setPlace] = useState("");
  const [tags, setTags] = useState("");
  const [visibility, setVisibility] = useState("");
  const [people, setPeople] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    let imageData: number[] = [];

    if (file) {
      const reader = new FileReader();
      const fileContent = await new Promise<ArrayBuffer>((resolve) => {
        reader.onload = (event) => resolve(event.target?.result as ArrayBuffer);
        reader.readAsArrayBuffer(file);
      });
      imageData = Array.from(new Uint8Array(fileContent));
    }

    const metadata = {
      description: description ? [description] : [],
      date: date ? [date] : [],
      place: place ? [place] : [],
      tags: tags ? [tags.split(",").map((tag) => tag.trim())] : [],
      visibility: [],
      people: people ? [people.split(",").map((person) => person.trim())] : [],
    };

    const memory = {
      texts:
        selectedType === "text"
          ? [
              [
                {
                  content: description,
                  metadata: [metadata],
                },
              ],
            ]
          : [],
      images:
        selectedType === "image"
          ? [
              [
                {
                  content: imageData,
                  metadata: [metadata],
                },
              ],
            ]
          : [],
    };

    console.log("Memory object:", JSON.stringify(memory, null, 2));
    try {
      console.log("Calling store_memory with:", memory);
      await futura_backend.store_memory(memory);
      setResponse("Upload successful!");
    } catch (error) {
      console.error("Error uploading:", error);
      setResponse(`Failed to upload: ${error.message}`);
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Label htmlFor="date" className="text-sm font-medium">
              Date
            </Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <Label htmlFor="place" className="text-sm font-medium">
              Place
            </Label>
            <Input
              id="place"
              placeholder="Type the place here."
              value={place}
              onChange={(e) => setPlace(e.target.value)}
            />
            <Label htmlFor="tags" className="text-sm font-medium">
              Tags
            </Label>
            <Input
              id="tags"
              placeholder="Type your tags here, separated by commas."
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <Label htmlFor="visibility" className="text-sm font-medium">
              Visibility
            </Label>
            <Input
              id="visibility"
              placeholder="Type visibility (e.g., user IDs) here."
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
            />
            <Label htmlFor="people" className="text-sm font-medium">
              People
            </Label>
            <Input
              id="people"
              placeholder="Type names or IDs of people here."
              value={people}
              onChange={(e) => setPeople(e.target.value)}
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
