import { config } from "../../constants/config";

export function isDevelopment() {
    const nodeEnv = config.NODE_ENV?.toLowerCase();
    return nodeEnv !== 'production';
}