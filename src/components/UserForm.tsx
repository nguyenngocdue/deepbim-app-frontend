import { useForm } from 'react-hook-form';
import axios from 'axios';

interface UserFormData {
  email: string;
  name: string;
}

export default function UserForm() {
  const { register, handleSubmit, reset } = useForm<UserFormData>();

  const onSubmit = async (data: UserFormData) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users`, data);
      console.log('User created:', response.data);
      alert('User created successfully!');
      reset(); // Reset form sau khi gửi thành công
    } catch (error) {
      console.error('Failed to create user:', error);
      alert('Failed to create user!');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px' }}>
      <label>Email:</label>
      <input type="email" {...register('email')} required />

      <label>Name:</label>
      <input type="text" {...register('name')} required />

      <button type="submit" style={{ marginTop: '10px' }}>Ok</button>
    </form>
  );
}
