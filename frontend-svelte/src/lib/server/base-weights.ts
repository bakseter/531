import type { Profile } from '$lib/types';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import {
  type BaseWeights,
  baseWeightsDecoder,
  type BaseWeightsModifier,
  baseWeightsModifierDecoder
} from '$lib/types';

const BaseWeightsAPI = {
  getBaseWeights: async ({
    idToken,
    profile
  }: {
    idToken: string;
    profile: Profile;
  }): Promise<BaseWeights | undefined> => {
    const response = await fetch(`${PUBLIC_BACKEND_URL}/base-weights?profile=${profile}`, {
      headers: { Authorization: `Bearer ${idToken}` }
    });

    if (response.status !== 200 && response.status !== 204)
      throw new Error(`Failed to GET base weights: ${response.status}, ${response.statusText}`);
    if (response.status === 204) return undefined;

    const json = await response.json();
    return baseWeightsDecoder(json);
  },

  putBaseWeights: async ({
    idToken,
    profile,
    baseWeights
  }: {
    idToken: string;
    profile: Profile;
    baseWeights: BaseWeights;
  }): Promise<void> => {
    const response = await fetch(`${PUBLIC_BACKEND_URL}/base-weights?profile=${profile}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
      body: JSON.stringify(baseWeights)
    });

    if (response.status !== 200 && response.status !== 204)
      throw new Error(`Failed to PUT base weights: ${response.statusText}`);
  },

  getBaseWeightsModifier: async ({
    idToken,
    profile,
    cycle
  }: {
    idToken: string;
    profile: Profile;
    cycle: number;
  }): Promise<BaseWeightsModifier | undefined> => {
    const response = await fetch(
      `${PUBLIC_BACKEND_URL}/base-weights/modifier/${cycle}?profile=${profile}`,
      {
        headers: { Authorization: `Bearer ${idToken}` }
      }
    );

    if (response.status !== 200 && response.status !== 204)
      throw new Error(`Failed to GET base weights modifier: ${response.statusText}`);
    if (response.status === 204) return undefined;

    const json = await response.json();
    return baseWeightsModifierDecoder(json);
  },

  putBaseWeightsModifier: async ({
    idToken,
    profile,
    baseWeightsModifier
  }: {
    idToken: string;
    profile: Profile;
    baseWeightsModifier: BaseWeightsModifier;
  }): Promise<void> => {
    const response = await fetch(`${PUBLIC_BACKEND_URL}/base-weights/modifier?profile=${profile}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
      body: JSON.stringify(baseWeightsModifier)
    });

    if (response.status !== 200 && response.status !== 204)
      throw new Error(`Failed to PUT base weights modifier: ${response.statusText}`);
  }
};

export default BaseWeightsAPI;
