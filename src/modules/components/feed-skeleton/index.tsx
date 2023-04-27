import { Skeleton } from "@mui/material";

export default function SkeletonFeed() {
  return (
    <>
      {Array(30)
        .fill(0)
        .map((item: any) => {
          return (
            <div className="px-4 py-4 border">
              <Skeleton height={32} />
            </div>
          );
        })}
    </>
  );
}
