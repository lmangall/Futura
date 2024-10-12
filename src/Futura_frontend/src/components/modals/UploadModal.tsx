import { Modal } from "./modal";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { File } from "lucide-react";
import { IDL } from "@dfinity/candid";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const Metadata = IDL.Record({
  description: IDL.Opt(IDL.Text),
  date: IDL.Opt(IDL.Text),
  place: IDL.Opt(IDL.Text),
  tags: IDL.Opt(IDL.Vec(IDL.Text)),
  visibility: IDL.Opt(IDL.Vec(IDL.Principal)),
  people: IDL.Opt(IDL.Vec(IDL.Text)),
});

const TextType = IDL.Record({
  content: IDL.Text,
  metadata: IDL.Opt(Metadata),
});

const ImageType = IDL.Record({
  content: IDL.Vec(IDL.Nat8),
  metadata: IDL.Opt(Metadata),
});

const MemoryType = IDL.Record({
  texts: IDL.Opt(IDL.Vec(TextType)),
  images: IDL.Opt(IDL.Vec(ImageType)),
});

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  if (!isOpen) return null;

  const [selectedType, setSelectedType] = useState<"text" | "image">("text");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [place, setPlace] = useState("");
  const [tags, setTags] = useState("");
  const [visibility, setVisibility] = useState("");
  const [people, setPeople] = useState("");

  return (
    <Modal onClose={onClose}>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex space-x-2">
            <Badge
              onClick={() => setSelectedType("text")}
              className={
                selectedType === "text"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }
            >
              Text
            </Badge>
            <Badge
              onClick={() => setSelectedType("image")}
              className={
                selectedType === "image"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }
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
            <Textarea
              id="date"
              placeholder="Type the date here."
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <Label htmlFor="place" className="text-sm font-medium">
              Place
            </Label>
            <Textarea
              id="place"
              placeholder="Type the place here."
              value={place}
              onChange={(e) => setPlace(e.target.value)}
            />
            <Label htmlFor="tags" className="text-sm font-medium">
              Tags
            </Label>
            <Textarea
              id="tags"
              placeholder="Type your tags here, separated by commas."
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <Label htmlFor="visibility" className="text-sm font-medium">
              Visibility
            </Label>
            <Textarea
              id="visibility"
              placeholder="Type visibility (e.g., user IDs) here."
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
            />
            <Label htmlFor="people" className="text-sm font-medium">
              People
            </Label>
            <Textarea
              id="people"
              placeholder="Type names or IDs of people here."
              value={people}
              onChange={(e) => setPeople(e.target.value)}
            />
          </div>
          <div className="border-2 border-dashed border-gray-200 rounded-lg flex flex-col gap-1 p-6 items-center">
            <File className="w-12 h-12" />
            <span className="text-sm font-medium text-gray-500">
              Drag and drop a file or click to browse
            </span>
            <span className="text-xs text-gray-500">
              PDF, image, video, or audio
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <Label htmlFor="file" className="text-sm font-medium">
              File
            </Label>
            <Input id="file" type="file" placeholder="File" accept="image/*" />
          </div>
        </CardContent>
        <CardFooter>
          <Button size="lg">Upload</Button>
        </CardFooter>
      </Card>
    </Modal>
  );
}
