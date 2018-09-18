import { User } from "Lib/types";
import _ from "lodash";

const users: Record<string, Partial<User>> = {
  U025LF8BP: { name: "Filip" },
  U15G19DGE: { name: "Alex", delivery: true, sales: true },
  U025LLUMV: { name: "Anton", delivery: true, sales: true },
  U3N0CPWN4: { name: "Oskar" },
  U78656JG0: { name: "Khaista", sales: true },
  U3V0H9NLA: { name: "Love", delivery: true },
  UAK4HEXFW: { name: "Sofia", sales: true },
  UB9BP16UX: { name: "TJ", delivery: true },
  UB292NRFH: { name: "James" },
  U0362PZ56: { name: "Strömmis" }
};

export const userMap: Record<string, User> = Object.keys(users).reduce(
  (acc, id) => ({ [id]: _.assign(users[id], { id }), ...acc }),
  {}
);

export const userList = _.values(userMap);

export const deliveryUsers = userList.filter(u => u.delivery);
export const salesUsers = userList.filter(u => u.sales);

export const getUsersForDomain = (domain: string) => {
  const domUncased = domain.toLowerCase();
  return userList.filter(u => (u as any)[domUncased]);
};
