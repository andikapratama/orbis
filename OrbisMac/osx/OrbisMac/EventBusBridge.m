//
//  EventBusBridge.m
//  OrbisMac
//
//  Created by Andika Pratama on 22/04/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "EventBusBridge.h"

@implementation EventBusBridge

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(post : (NSString *)name dict : (NSDictionary *)dict) {
  [[NSNotificationCenter defaultCenter] postNotificationName:name
                                                      object:self
                                                    userInfo:dict];
}

@end
