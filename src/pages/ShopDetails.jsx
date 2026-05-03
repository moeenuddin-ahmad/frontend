import { useParams, Link, useNavigate } from "react-router-dom";
import { useGetShopByIdQuery } from "../redux/features/shops/shopsApi";
import { useDeleteProductMutation } from "../redux/features/products/productsApi";
import { DataTable } from "../components/ui/datatable";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Edit, Trash } from "lucide-react";

function ShopDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: shop, isLoading, isError } = useGetShopByIdQuery(id);
  const [deleteProduct] = useDeleteProductMutation();

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId).unwrap();
        toast("Product deleted successfully");
      } catch (err) {
        toast("Failed to delete product");
      }
    }
  };

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading shop details...
      </div>
    );

  if (isError || !shop)
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Error fetching shop details or shop not found.
      </div>
    );

  const productColumns = [
    { accessorKey: "id", header: "Product ID" },
    { accessorKey: "name", header: "Product Name" },
    { accessorKey: "price", header: "Price ($)" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Link to={`/shop/${shop.id}/product/${row.original.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit size={14} className="mr-1" /> Edit
            </Button>
          </Link>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDeleteProduct(row.original.id)}
          >
            <Trash size={14} className="mr-1" /> Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Shop details</h1>
        <Link to="/">
          <Button variant="outline">Back to Shops</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shop Info</CardTitle>
          <CardDescription>Overview of the shop</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>Name:</strong> {shop.name}
          </p>
          <p>
            <strong>Shop ID:</strong> {shop.id}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4 mb-4">
          <div className="space-y-1">
            <CardTitle>Products</CardTitle>
            <CardDescription>All products within {shop.name}</CardDescription>
          </div>
          <Link to={`/shop/${id}/product/create`}>
            <Button>Create Product</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <DataTable columns={productColumns} data={shop.products || []} />
        </CardContent>
      </Card>
    </div>
  );
}

export default ShopDetails;
