import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateProductMutation } from "../redux/features/products/productsApi";

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

const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters."),
  price: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Price must be non-negative."),
  ),
});

export default function CreateProduct() {
  const navigate = useNavigate();
  const { id: shopId } = useParams();
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: "",
    },
  });

  async function onSubmit(data) {
    try {
      await createProduct({ ...data, shopId }).unwrap();
      toast("Product created successfully!");
      navigate(`/shop/${shopId}`);
    } catch (error) {
      toast("Failed to create product", {
        description: error?.data?.message || "An error occurred.",
      });
    }
  }

  return (
    <div className="container mx-auto py-10 flex justify-center mt-10">
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Create New Product</CardTitle>
          <CardDescription>
            Add a new product to your shop inventory.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="create-product-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="name">Product Name</FieldLabel>
                    <Input
                      {...field}
                      id="name"
                      type="text"
                      className="h-11"
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. Vintage Vase"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error?.message]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="price"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="price">Price ($)</FieldLabel>
                    <Input
                      {...field}
                      id="price"
                      type="number"
                      className="h-11"
                      min="0"
                      step="0.01"
                      aria-invalid={fieldState.invalid}
                      placeholder="19.99"
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
            onClick={() => navigate(`/shop/${shopId}`)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" form="create-product-form" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Product"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
