import BackButton from "@/components/back-button";
import RecoverAccountForm from "@/modules/auth/recover-account-form";

export default function RecoverAccountEmail() {
  return (
    <section className="flex justify-center items-center">
      <div className="top-8 left-8 absolute">
        <BackButton />
      </div>
      <RecoverAccountForm />
    </section>
  );
}
