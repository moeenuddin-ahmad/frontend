import {
  useGetShopsQuery,
  useDeleteShopMutation,
} from "../redux/features/shops/shopsApi";
import { DataTable } from "../components/ui/datatable";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { Edit, Trash } from "lucide-react";

function Shops() {
  const navigate = useNavigate();
  const [deleteShop] = useDeleteShopMutation();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const { data, isLoading, isError } = useGetShopsQuery(pagination);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this shop?")) {
      try {
        await deleteShop(id).unwrap();
        toast("Shop deleted successfully");
      } catch (err) {
        toast("Failed to delete shop");
      }
    }
  };

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading shops...
      </div>
    );
  if (isError)
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Error fetching data
      </div>
    );

  const columns = [
    { accessorKey: "id", header: "Shop ID" },
    {
      accessorKey: "name",
      header: "Shop Name",
      cell: ({ row }) => (
        <Link
          to={`/shop/${row.original.id}`}
          className="text-blue-600 hover:underline font-medium"
        >
          {row.original.name}
        </Link>
      ),
    },
    {
      id: "productsCount",
      accessorFn: (row) => row._count?.products || 0,
      header: "Products Count",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Link to={`/shop/${row.original.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit size={14} className="mr-1" /> Edit
            </Button>
          </Link>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(row.original.id)}
          >
            <Trash size={14} className="mr-1" /> Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Shop Management</h1>
        <Link to="/shop/create">
          <Button>Create Shop</Button>
        </Link>
      </div>
      <DataTable
        columns={columns}
        data={data?.data}
        onNext={() =>
          setPagination({ ...pagination, page: pagination.page + 1 })
        }
        onPrev={() =>
          setPagination({ ...pagination, page: pagination.page - 1 })
        }
        onPageChange={(page) => setPagination({ ...pagination, page })}
        hasNext={data?.meta?.hasNextPage}
        hasPrev={data?.meta?.hasPreviousPage}
        currentPage={data?.meta?.currentPage}
        totalPages={data?.meta?.totalPages}
        onPageSizeChange={(pageSize) =>
          setPagination({ ...pagination, limit: pageSize, page: 1 })
        }
        pageSize={pagination.limit}
      />
    </div>
  );
}

export default Shops;
