import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <h1 className="text-4xl font-semibold tracking-tight">Nothing here.</h1>
      <p className="mt-4 text-ink/70">That page does not exist, or it sold out.</p>
      <Link
        href="/shop"
        className="mt-10 inline-flex h-11 items-center rounded-md bg-ink px-6 text-sm font-medium text-paper hover:opacity-85"
      >
        Shop tees
      </Link>
    </div>
  );
}
