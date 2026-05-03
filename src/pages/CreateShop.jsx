import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useCreateShopMutation } from "../redux/features/shops/shopsApi";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const shopSchema = z.object({
  name: z.string().min(2, "Shop name must be at least 2 characters."),
});

export default function CreateShop() {
  const navigate = useNavigate();
  const [createShop, { isLoading }] = useCreateShopMutation();

  const form = useForm({
    resolver: zodResolver(shopSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(data) {
    try {
      const result = await createShop(data).unwrap();
      toast("Shop created successfully!");
      navigate(`/shop/${result.id}`);
    } catch (error) {
      toast("Failed to create shop", {
        description: error?.data?.message || "An error occurred.",
      });
    }
  }

  return (
    <div className="container mx-auto py-10 flex justify-center mt-10">
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Create New Shop</CardTitle>
          <CardDescription>
            Provide a name for your new storefront.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="create-shop-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="name">Shop Name</FieldLabel>
                    <Input
                      {...field}
                      id="name"
                      type="text"
                      className="h-11"
                      aria-invalid={fieldState.invalid}
                      placeholder="My Awesome Shop"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error?.message]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/")}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" form="create-shop-form" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Shop"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
