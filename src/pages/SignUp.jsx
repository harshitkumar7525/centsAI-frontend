import { useForm } from "react-hook-form"

function SignUp() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log("Sign Up Data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          {...register("email", { required: true })}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          {...register("password", { required: true })}
        />
      </div>
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default SignUp