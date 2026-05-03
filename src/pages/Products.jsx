import { useGetProductsQuery } from "../redux/features/products/productsApi";
import { DataTable } from "../components/ui/datatable";
import { useState } from "react";

function Products() {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 2,
  });

  const { data, isLoading, isError } = useGetProductsQuery(pagination);

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  if (isError)
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Error fetching data
      </div>
    );

  const columns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Product Name" },
    { accessorKey: "price", header: "Price" },
    { accessorKey: "category", header: "Category" },
    { accessorKey: "countInStock", header: "Stock" },
  ];

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Product Management
      </h1>
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

export default Products;
