const previousBrandName = /jokihub/gi;

export const withCurrentBrandName = (value: string): string => value.replace(previousBrandName, 'bongastore');
