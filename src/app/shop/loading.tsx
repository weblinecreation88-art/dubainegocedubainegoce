
import { Skeleton } from "@/components/ui/skeleton";
import { Filter } from 'lucide-react';

export default function ShopAllLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <Skeleton className="h-10 w-64 mx-auto" />
        <Skeleton className="h-4 w-96 mx-auto mt-4" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="hidden lg:block lg:col-span-1">
             <div className="sticky top-24 space-y-6">
                <Skeleton className="h-8 w-32" />
                 <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-16 w-full" />
                 </div>
             </div>
        </aside>

        <main className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
                 <Skeleton className="h-5 w-40" />
                <div className="flex items-center gap-4">
                    <div className="lg:hidden">
                        <Skeleton className="h-10 w-28" />
                    </div>
                     <Skeleton className="h-10 w-44" />
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                    <div key={i} className="flex flex-col space-y-2">
                        <Skeleton className="aspect-square w-full" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ))}
            </div>
        </main>
      </div>
    </div>
  );
}
