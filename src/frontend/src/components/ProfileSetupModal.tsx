import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Variant_customer_serviceProvider } from "../backend";
import type { UserProfile } from "../backend";
import { useSaveCallerUserProfile } from "../hooks/useQueries";

interface ProfileSetupModalProps {
  onDismiss: () => void;
  onProfileCreated: () => void;
}

export default function ProfileSetupModal({
  onDismiss,
  onProfileCreated,
}: ProfileSetupModalProps) {
  const [name, setName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [userType, setUserType] = useState<Variant_customer_serviceProvider>(
    Variant_customer_serviceProvider.customer,
  );
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !contactInfo.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    const profile: UserProfile = {
      name: name.trim(),
      contactInfo: contactInfo.trim(),
      userType: userType,
    };

    try {
      await saveProfile.mutateAsync(profile);
      toast.success("Profile created successfully!");
      onProfileCreated();
    } catch (error) {
      console.error("Profile creation error:", error);
      toast.error("Failed to create profile");
    }
  };

  const handleSkip = () => {
    toast.info("You can create your profile later from the user menu");
    onDismiss();
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onDismiss()}>
      <DialogContent className="sm:max-w-md">
        <button
          type="button"
          onClick={handleSkip}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          aria-label="Skip profile setup"
        >
          <X className="h-4 w-4" />
        </button>

        <DialogHeader>
          <DialogTitle>Welcome to SCOOPEX Shift</DialogTitle>
          <DialogDescription>
            Complete your profile to get the best experience with our packers
            and movers platform. You can skip this step and create your profile
            later.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">Contact Information</Label>
            <Input
              id="contact"
              placeholder="Email or phone number"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>I am a</Label>
            <RadioGroup
              value={userType}
              onValueChange={(value) =>
                setUserType(value as Variant_customer_serviceProvider)
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value={Variant_customer_serviceProvider.customer}
                  id="customer"
                />
                <Label
                  htmlFor="customer"
                  className="font-normal cursor-pointer"
                >
                  Customer (looking for moving services)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value={Variant_customer_serviceProvider.serviceProvider}
                  id="serviceProvider"
                />
                <Label
                  htmlFor="serviceProvider"
                  className="font-normal cursor-pointer"
                >
                  Service Provider (offering moving services)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleSkip}
            >
              Skip for Now
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#003D91] to-[#0094E0] hover:from-[#002D71] hover:to-[#0084D0]"
              disabled={saveProfile.isPending}
            >
              {saveProfile.isPending ? "Creating..." : "Create Profile"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
