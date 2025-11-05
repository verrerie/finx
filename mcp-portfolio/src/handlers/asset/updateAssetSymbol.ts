import { success, error } from '../../utils/response.js';
import type { ToolHandler } from '../types.js';

export const updateAssetSymbol: ToolHandler = async (args, { assetService }) => {
  if (!args || typeof args !== 'object' || !('asset_id' in args) || !('new_symbol' in args)) {
    return error('Missing arguments');
  }

  const { asset_id, new_symbol } = args;

  if (typeof asset_id !== 'string' || typeof new_symbol !== 'string') {
    return error('Invalid argument types');
  }

  try {
    const asset = await assetService.updateAssetSymbol(asset_id, new_symbol);
    return success({ asset, message: `Asset symbol updated to ${new_symbol}` });
  } catch (e: any) {
    return error(e.message);
  }
};
