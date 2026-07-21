import { UsersUserPageContent } from "@/components/admin/adminUsers/users-user-page";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function UserDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <UsersUserPageContent userId={id} />;
}
