/*
 * The simplest kernel module
 */

#include <linux/module.h>
#include <linux/kernel.h>

#define DRIVER_LICENCE "GPL"
#define DRIVER_AUTHOR "Clatron"
#define DRIVER_DESC "A simple dummy kernel module"

static int hi_init(void) {
    printk(KERN_ALERT "Hi \n");
    return 0;
}

static void hi_exit(void) {
    printk(KERN_ALERT "Bye \n");
}

module_init(hi_init);
module_exit(hi_exit);

MODULE_LICENSE(DRIVER_LICENCE);
MODULE_AUTHOR(DRIVER_AUTHOR);
MODULE_DESCRIPTION(DRIVER_DESC);
