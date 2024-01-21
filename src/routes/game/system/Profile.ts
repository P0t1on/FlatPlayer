import { cloneDeep } from "lodash";

const ProfileStorage = {
  indexedDB: {
    save: (profile: Profile) => {
      localStorage.setItem(profile.name, JSON.stringify(profile.data));
    },
    loadProfile: (name: string) => {
      const data = localStorage.getItem(name);

      return data ? new Profile(name, JSON.parse(data), "localStorage") : undefined;
    },
  },
  localStorage: {
    save: (profile: Profile) => {},
    loadProfile: (name: string) => { return undefined },
  },
};

type StorageType = keyof typeof ProfileStorage;

export class Profile {
  private static readonly DefaultProfile = new Profile(
    "default",
    {},
    "localStorage"
  );

  public readonly name: string;
  public readonly data: { [key: string]: any };
  public storageType: StorageType = "localStorage";

  public constructor(name: string, baseProfile: Profile);
  public constructor(name: string, baseData: any, storageType: StorageType);
  public constructor(...args: any[]) {
    if (args.length == 1) {
      const [name] = args as [string];

      this.name = name;
      this.data = cloneDeep(Profile.DefaultProfile.data);
    } else if (args.length == 2) {
      const [name, baseProfile] = args as [string, Profile];

      this.name = name;
      this.data = cloneDeep(baseProfile.data);
    } else {
      const [name, baseData, storageType] = args as [string, any, StorageType];

      this.name = name;
      this.data = baseData;
      this.storageType = storageType;
    }
  }

  public static load(type: StorageType, name: string) {
    return ProfileStorage[type].loadProfile(name);
  }

  public static getProfileList(type: StorageType) {}

  public save() {
    ProfileStorage[this.storageType].save(this);
  }

  public export() {
    navigator.clipboard.writeText(
      JSON.stringify({
        name: this.name,
        data: this.data,
      })
    );
  }
}
