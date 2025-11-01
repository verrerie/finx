import { success, error } from '../../utils/response.js';
import type { ToolHandler } from '../types.js';

export const createAsset: ToolHandler = async (args, { assetService }) => {
  if (!args || typeof args !== 'object' || !('asset_type' in args) || !('name' in args)) {
    return error('Missing arguments');
  }

  const asset = await assetService.createAsset(args);

  return success({ asset, message: `Asset ${asset.name} created` });
};
