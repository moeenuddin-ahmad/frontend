import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetProductQuery,
  useUpdateProductMutation,
} from "../redux/features/products/productsApi";

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

export default function EditProduct() {
  const { id, productId } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading: isFetching } =
    useGetProductQuery(productId);
  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: { name: "", price: "" },
  });

  React.useEffect(() => {
    if (product) {
      form.reset({ name: product.name, price: product.price });
    }
  }, [product, form]);

  async function onSubmit(data) {
    try {
      await updateProduct({ id: productId, body: data }).unwrap();
      toast("Product updated successfully!");
      navigate(`/shop/${id}`);
    } catch (error) {
      toast("Failed to update product", {
        description: error?.data?.message || "An error occurred.",
      });
    }
  }

  if (isFetching)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="container mx-auto py-10 flex justify-center mt-10">
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
          <CardDescription>Update your product details.</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="edit-product-form" onSubmit={form.handleSubmit(onSubmit)}>
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
                    <FieldLabel htmlFor="price">Price</FieldLabel>
                    <Input
                      {...field}
                      id="price"
                      type="number"
                      className="h-11"
                      step="0.01"
                      aria-invalid={fieldState.invalid}
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
            variant="outline"
            onClick={() => navigate(`/shop/${id}`)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" form="edit-product-form" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
