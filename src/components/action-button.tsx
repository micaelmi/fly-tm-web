const ActionButton = () => {
  return (
    <Link
      href={`/trainings/${training.id}/edit`}
      className="border-muted hover:border-muted-foreground p-2 border rounded-full text-muted hover:text-muted-foreground transition-all hover:cursor-pointer"
    >
      <Pencil />
    </Link>
  );
};
