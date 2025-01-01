import ReusableSidebar from "./sidebar";
import { ArrowLeftIcon } from "lucide-react";
import CreateDraftButton from "./create-draft-button";
import { SidebarBlogSection } from "./sidebar-blog-section";
import { getBlogs } from "@/service/blog";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";

const BlogSidebar: React.FC = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  const blogs = await getBlogs(user.accessToken);
  console.log(blogs, "blogs sidebar");

  const header = (
    <Link href="/" className="mx-auto ">
      <Image
        src={"/images/demo4.jpg"}
        alt="Logo"
        width={40}
        height={40}
        className="rounded-full"
      />
    </Link>
  );

  const content = (
    <>
      <CreateDraftButton />
      <SidebarBlogSection blogs={blogs} />
    </>
  );

  const footer = (
    <nav className="flex flex-col gap-2">
      {/* <Link href="/blogs/dashboard" className="flex items-center py-3 px-4 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-slate-900 rounded-md">
        <Settings className="mr-3" size={18} /> Blog dashboard
      </Link> */}
      <Link
        href="/admin"
        className="flex items-center py-3 px-4 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-slate-900 rounded-md"
      >
        <ArrowLeftIcon className="mr-3" size={18} /> Back Home
      </Link>
    </nav>
  );

  return <ReusableSidebar header={header} content={content} footer={footer} />;
};

export default BlogSidebar;