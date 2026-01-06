'use client';

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        "row-span-1 rounded-[2.5rem] group/bento hover:shadow-2xl transition duration-500 p-8 bg-card border justify-between flex flex-col space-y-6",
        className
      )}
    >
      <div className="flex-1">
        {header}
      </div>
      <div className="group-hover/bento:translate-x-2 transition duration-300">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <div className="font-black text-xl tracking-tight">
            {title}
          </div>
        </div>
        <div className="font-medium text-muted-foreground text-sm leading-relaxed">
          {description}
        </div>
      </div>
    </motion.div>
  );
};
