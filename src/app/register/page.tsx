import BackButton from "@/components/back-button";
import RegisterForm from "@/modules/auth/register-form";

export default function Register() {
  return (
    <section className="flex justify-center items-cente my-8">
      <div className="top-8 left-8 absolute">
        <BackButton />
      </div>
      <RegisterForm />
    </section>
  );
}
