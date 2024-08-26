import BackButton from "@/components/back-button";
import LoginForm from "@/modules/auth/login-form";

export default function Login() {
  return (
    <section className="flex justify-center items-center h-screen">
      <div className="top-8 left-8 absolute">
        <BackButton />
      </div>
      <LoginForm />
    </section>
  );
}
