import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetShopByIdQuery,
  useUpdateShopMutation,
} from "../redux/features/shops/shopsApi";
import { handleApiError } from "../lib/handleApiError";

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

export default function EditShop() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: shop, isLoading: isFetching } = useGetShopByIdQuery(id);
  const [updateShop, { isLoading }] = useUpdateShopMutation();

  const form = useForm({
    resolver: zodResolver(shopSchema),
    defaultValues: { name: "" },
  });

  React.useEffect(() => {
    if (shop) {
      form.reset({ name: shop.name });
    }
  }, [shop, form]);

  async function onSubmit(data) {
    try {
      await updateShop({ id, body: data }).unwrap();
      toast.success("Shop updated successfully!");
      navigate("/");
    } catch (error) {
      handleApiError(error, "Failed to update shop");
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
          <CardTitle>Edit Shop</CardTitle>
          <CardDescription>Update your shop's information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="edit-shop-form" onSubmit={form.handleSubmit(onSubmit)}>
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
            onClick={() => navigate("/")}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" form="edit-shop-form" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
