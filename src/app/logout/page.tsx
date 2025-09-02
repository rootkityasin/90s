import { logout } from '../login/actions';

export default function Logout() {
  return (
    <form action={logout} style={{ display:'flex', justifyContent:'center', marginTop:'3rem' }}>
      <button>Confirm Logout</button>
    </form>
  );
}